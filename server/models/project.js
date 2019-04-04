var mongoose    = require('mongoose');

var projectSchema  = mongoose.Schema({
    name: {
      type: String
    },
    Id: {
      type: Number,
      index: true,
      unique: true
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
