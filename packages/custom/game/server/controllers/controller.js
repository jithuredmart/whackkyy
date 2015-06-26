var MongoClient = require('mongodb').MongoClient;


var url = 'mongodb://jithu:GUPTA21!a@candidate.20.mongolayer.com:11143/ACM';

module.exports.insert_new= function(req, res, next){
var hashCode = function(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }
        var req_query = req.query;
   var full_event={name:req_query.name, userId:hashCode(req_query.name),score:parseInt(req_query.score), date:new Date()}
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('play_users').insert(full_event, function (err, records) {
      if (err) throw err;
      res.send("200");
    });
  })
}


module.exports.find_top_three= function(req, res, next){
  var req_query = req.query;
   var current_date= new Date();
   var match={$match:{date:{$lte:new Date(), $gte:new Date(current_date.setMonth(current_date.getMonth() - 6))}}}
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('play_users').aggregate([ match,{$group:{"_id":"$userId", "name":{"$first":"$name"}, "score":{"$first":"$score"}, "date":{"$first":"$date"}}}, {$project:{"name":1, "date":1, "score":1}},{$sort:{score:-1}},{$limit:3}], function (err, records) {
      if (err) throw err;
      if(records.length >0){
      res.send(records)
      }
      else{
       res.send([]);
      }
      })
    });
  }

module.exports.send_mail = function(req, res, next){
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'infowhackmole@gmail.com',
        pass: 'GUPTA21!aa'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
  var req_query = req.query;

var mailOptions = {
    from: 'infowhackmole@gmail.com', // sender address
    to: req_query.email, // list of receivers
    subject: 'Score Card of Whack A Mole ✔', // Subject line
    text: "Hi   "+req_query.name +" That was an Awesome play by you Dude , The score you have got is "+req_query.score,
    html: '<b>'+"Hi   "+req_query.name +" That was an Awesome play by you Dude , The score you have got is "+req_query.score+'</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        res.send([]);
        return console.log(error);
    }
    res.send(200)
});

}