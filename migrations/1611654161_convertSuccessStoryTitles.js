'use strict';

const getItemTypesByApiKey = require('./utils/getItemTypesByApiKey');
const createStructuredTextField = require('./utils/createStructuredTextField');
const markdownToStructuredText = require('./utils/markdownToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const itemTypesByApiKey = await getItemTypesByApiKey(client);

  for (let fieldApiKey of ['result', 'challenge', 'title']) {
    const legacyField = await client.fields.find(
      `success_story::${fieldApiKey}`,
    );

    await createStructuredTextField(
      client,
      'success_story',
      `${legacyField.label} (structured-text)`,
      `structured_text_${fieldApiKey}`,
    );
  }

  const records = await getAllRecords(client, 'success_story');

  for (const record of records) {
    console.log(`Record #${record.id}`);

    const updatedFields = {};

    for (let fieldApiKey of ['result', 'challenge', 'title']) {
      updatedFields[
        `structured_text_${fieldApiKey}`
      ] = await markdownToStructuredText(record[fieldApiKey]);
    }

    await client.items.update(record.id, updatedFields);

    if (record.meta.status !== 'draft') {
      console.log('Republish!');
      await client.items.publish(record.id);
    }
  }

  for (let fieldApiKey of ['result', 'challenge', 'title']) {
    await swapFields(client, 'success_story', fieldApiKey);
  }
};