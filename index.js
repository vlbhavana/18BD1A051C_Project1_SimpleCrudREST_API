var express = require('express');
var app =  express();

let server =  require('./server');
let middleware = require('./middleware');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'hospitalInventory';//db name
 let db     
 MongoClient.connect(url, (err,client)=>{
     if(err) return console.log(err);
     db = client.db(dbName);
     console.log(`Connected Database: ${url}`);
     console.log(`Database: ${dbName}`);
 });
 //Add Records to collections
 //Add a new Hospital detail
 app.post('/addVentilator',middleware.checkToken, (req,res) =>
 {
     var hId = req.body.hId;
     var ventilatorId = req.body.ventilatorId;
     var status = req.body.status;
     var name = req.body.name;
      
    var newVentilator = {
        hId:hId,ventilatorId:ventilatorId,status:status,name:name
    }
    db.collection('Ventilators').insertOne(newVentilator, function(err,result){
        res.json("New Ventilator Details Inserted");
        if(err) throw err;
    });
 });

 //Add a new ventilator detail
 app.post('/addHospital',middleware.checkToken, (req,res) =>
 {
     var hId = req.body.hId;
     var name = req.body.name;
     var location = req.body.location;
     var address = req.body.address;
     var contactNo = req.body.contactNo;
      
    var newHospital = {
        hId:hId,name:name,location:location,address:address,contactNo:contactNo
    }
    db.collection('hospital').insertOne(newHospital, function(err,result){
        res.json("New Hospital Details Inserted");
        if(err) throw err;
    });
 });
 

 //Searches
 //Search Details of all hospitals
 app.get('/hospitalDetails',middleware.checkToken, function(req,res)
 {
     console.log("Fetching details from hospital Collection");
     var data = db.collection('hospital').find().toArray()
     .then(result=> res.json(result));
 });

 //Search Details of all ventilators in database
 app.get('/ventilatorDetails',middleware.checkToken, (req,res) =>
 {
     console.log("Ventilators details");
     var ventilatordetails = db.collection('Ventilators').find().toArray()
     .then(result=> res.json(result));
 });

  //Search Details of Hospital based on name
  app.post('/searchHospitalByName',middleware.checkToken, (req,res) =>
 {
    console.log("Requested Ventilator name");
     var name = req.body.name;
     console.log(name);
     var ventilatordetails = db.collection('hospital').find({"name":name}).toArray()
     .then(result=> res.json(result));
 });

  //Search Details of Ventilators based on status
 app.post('/searchVentilatorByStatus',middleware.checkToken, (req,res) =>
 {
    console.log("Requested Ventilator status");
     var status = req.body.status;
     console.log(status);
     var ventilatordetails = db.collection('Ventilators').find({"status":status}).toArray()
     .then(result=> res.json(result));
 });

  //Search Details of Ventilators based on hospital name
 app.post('/searchVentilatorByHospitalName',middleware.checkToken, (req,res) =>
 {
    console.log("Requested Ventilator details using HospitalName");
     var name = req.body.name;
     console.log(name);
     var ventilatordetails = db.collection('Ventilators').find({"name":name}).toArray()
     .then(result=> res.json(result));
 });


 //Update details
 app.put('/updateVentilatorStatus',middleware.checkToken, (req,res) =>
 {
     var ventilatorID ={ventilatorId : req.body.ventilatorId};
     console.log(ventilatorID);
     var newStatus = {$set: {status:req.body.status} }; 
     db.collection('Ventilators').updateOne(ventilatorID,newStatus,function(err,result)
     {
         res.json("1 ventilator document updated");
         if(err) throw err;
     });
 });


 //Delete 
 //Delete ventilator by ventilatorId
 app.delete('/deleteVentilatorById',middleware.checkToken, (req,res) =>
 {
     var ventilatorID =req.body.ventilatorId;
    console.log(ventilatorID);
    var RecordToDelete = { ventilatorId : ventilatorID}; 
    db.collection('Ventilators').deleteOne(RecordToDelete,function(err,obj)
    {
        if(err) throw err;
        res.json("1 ventilator document deleted");
    });
 });

 //Delete hospital by hospitalId
 app.delete('/deleteHospitalById',middleware.checkToken, (req,res) =>
 {
     var hID =req.query.hId;
     console.log(hID);
     var RecordToDelete = { hIs : hID}; 
     db.collection('hospital').deleteOne(RecordToDelete,function(err,obj)
     {
         if(err) throw err;
         res.json("1 hospital document deleted");
     });
 });
 app.listen(1100); 