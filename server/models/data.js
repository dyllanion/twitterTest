var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var DataSchema = new mongoose.Schema({
}, { strict: false, collection: 'data' });
var DataRes = mongoose.model('data', DataSchema);
exports.DataRes = DataRes;

var TampaSchema = new mongoose.Schema({

}, { strict: false, collection: 'trends_tampa' });
var TampaTrends = mongoose.model('trends_tampa', TampaSchema);
exports.TampaTrends = TampaTrends;



var NasaSchema = new mongoose.Schema({

}, { strict: false, collection: 'search_nasa' });
var NasaTrends = mongoose.model('search_nasa', NasaSchema);
exports.NasaTrends = NasaTrends;



var StudentSchema = new mongoose.Schema({

}, { strict: false, collection: 'search_student' });
var StudentTrends = mongoose.model('search_student', StudentSchema);
exports.StudentTrends = StudentTrends;



var UniversitySchema = new mongoose.Schema({

}, { strict: false, collection: 'search_university' });
var UniversityTrends = mongoose.model('search_university', UniversitySchema);
exports.UniversityTrends = UniversityTrends;


var AvailableSchema = new mongoose.Schema({

}, { strict: false, collection: 'trends_available' });
var AvailableTrends = mongoose.model('trends_available', AvailableSchema);
exports.AvailableTrends = AvailableTrends;


var GlobalSchema = new mongoose.Schema({

}, { strict: false, collection: 'trends_global' });
var GlobalTrends = mongoose.model('trends_global', GlobalSchema);
exports.GlobalTrends = GlobalTrends;



// DataSchema.pre('save', function (next) {
//     var user = this;
//     console.log("Pre Triggered")
//   });

//   var Data = mongoose.model('Data', DataSchema);
//   exports.Data = Data;