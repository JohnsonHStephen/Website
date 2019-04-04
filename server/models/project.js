var mongoose    = require('mongoose');

var projectSchema  = mongoose.Schema({
    name: {
      type: String
    },
    gitUrl: {
      type: String
    },
    description: {
      type: String
    },
    updated: {
      type: Date
    },
    imagePath: {
      type: String
    }
});

const Project = module.exports = mongoose.model('Project', projectSchema);
