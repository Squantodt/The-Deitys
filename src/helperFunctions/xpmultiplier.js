const multiplierSchema = require("../schemas/xpmultiplier");

const updateMultiplier = async (filter, update) => {
  const options = {
    upsert: true, // Creates a new document if a document matches the filter or update the document if it exists
    new: true, // Returns the updated document instead of the original document
    runValidators: true, // Runs validation if any on the update operation
  };

  const result = await multiplierSchema
    .findOneAndUpdate(filter, update, options)
    .exec();

  return result;
};

const getMultiplier = async (user) => {
  const multipliers = await getAllMultipliers();

  // get all role id's of a user
  // loop over multipliers until 1 is found and return that multiplier
};

const getAllMultipliers = async () => {
  const multipliers = await multiplierSchema
    .find()
    .sort({ Multiplier: -1 })
    .exec();
  return multipliers;
};

// Example usage
// const filter = { name: "example" };
// const update = { count: 1 };

// const result = await updateOrCreateRecord(filter, update);
// console.log(result); // Logs the updated or newly created document

module.exports = {
  updateMultiplier,
  getMultiplier,
};
