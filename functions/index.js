const functions = require('firebase-functions');
const admin = require('firebase-admin');
// connect to real time database
var config = {
    apiKey: "AIzaSyAmnOT5M7mhm92PcKxPEBOxM3mDnB8xsps",
    authDomain: "sak-robot.firebaseapp.com",
    databaseURL: "https://sak-robot-39a4c.firebaseio.com/",
  };

admin.initializeApp(config);
var users_db = admin.database().ref("users");
 
exports.listUser = functions.https.onRequest(async (req, res) =>{
      var rows = []
      users_db.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // key will be "ada" the first time and "alan" the second time
        var key = childSnapshot.key;
        console.log('the key ',key);
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        console.log('the value ', childData);
        rows.push(childData);
  });
    res.json({rows : rows});
    // Terminate HTTP functions with res.redirect(), res.send(), or res.end().
  });
  });

exports.addUser = functions.https.onRequest(async (req,res) =>{
  /**
   * add node to exist node 
   * 1) get the node you want to add on it refrence 
   * db.child('refrence to the desired node').set(obj)
   * 2) note that set will overwrite the value if the node has already value on it
   * 3) adding data to the node without overwrite the value 
   * newnode = dbref.push()
   * newnode.key // get the key of the new node
   * newnode.set(object) // add to the new node refrence 
   * 4) if you want to add new node with your own key
   * dbref.update({
   *    uniqueID : {
   *    }
   * })
   */
  let request_data = req.body;
  let new_user = (await users_db.push()).set(request_data);
  users_db.once("child_added").then(function(snapshot){
    console.log('a child added ', snapshot.val);
  });
  res.json(new_user);
});

exports.editUser = functions.https.onRequest(async (req,res) =>{
  /**
   * edit exist value on a node using path + update
   */
  let userID = req.body.userID;
  users_db.child(userID).update({name:"YoumnaAli"});
  res.json("updated ")
});

exports.removeUser = functions.https.onRequest(async (req,res) =>{
  /**
   * delete an exist node using path + set(null)
   */
  let userID = req.body.userID;
  users_db.child(userID).set(null);
  res.json("deleted ")
});