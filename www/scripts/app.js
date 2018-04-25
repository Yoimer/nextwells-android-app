/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        // Wait for Cordova to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        var currentRow;
        // Populate the database
         //
        function populateDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT, name,number)');
            }

        // Query the database
        //
        function queryDB(tx) {
            tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }

        function searchQueryDB(tx) {
            tx.executeSql("SELECT * FROM DEMO where name like ('%"+ document.getElementById("txtName").value + "%')", [], querySuccess, errorCB);
            }
            // Query the success callback
            //
        function querySuccess(tx, results) {
            var tblText = '<table id="t01"><tr><th>ID</th> <th>Name</th> <th>Number</th></tr>';
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var tmpArgs=results.rows.item(i).id + ",'" + results.rows.item(i).name + "','" + results.rows.item(i).number+"'";
                tblText += '<tr onclick="goPopup('+ tmpArgs + ');"><td>' + results.rows.item(i).id +'</td><td>' + results.rows.item(i).name +'</td><td>' + results.rows.item(i).number +'</td></tr>';
                }
                tblText += "</table>";
                document.getElementById("tblDiv").innerHTML = tblText;
            }

        //Delete query
        function deleteRow(tx) {
            tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
            }

        // Transaction error callback
        //
        function errorCB(err) {
            alert("Error processing SQL: "+err.code);
            }

        // Transaction success callback
        //
        function successCB() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
            }

        // Cordova is ready
        //
        function onDeviceReady() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(populateDB, errorCB, successCB);
            }

        //Insert query
        //
        function insertDB(tx) {
            tx.executeSql('INSERT INTO DEMO (name,number) VALUES ("' +document.getElementById("txtName").value +'","'+document.getElementById("txtNumber").value+'")');
        }

        //Show the popup after tapping a row in table
        //
        function goPopup(row,rowname,rownum) {
            currentRow = row;
            document.getElementById("qrpopup").style.display = "block";
            document.getElementById("editNameBox").value = rowname;
            document.getElementById("editNumberBox").value = rownum;
        }

        function editRow(tx) {
            tx.executeSql('UPDATE DEMO SET name ="' + document.getElementById("editNameBox").value + '", number= "'+document.getElementById("editNumberBox").value + '" WHERE id = ' + currentRow, [], queryDB, errorCB);
        }

        //goDelete()
        document.querySelector('.go-delete').addEventListener('click', function() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(deleteRow, errorCB);
            document.getElementById('qrpopup').style.display='none';
        });

        //goEdit()
        document.querySelector('.go-edit').addEventListener('click', function() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(editRow, errorCB);
            document.getElementById('qrpopup').style.display = 'none';
        });

        //#discard
        document.querySelector('#discard').addEventListener('click', function() {
            document.getElementById('qrpopup').style.display='none';
        });

        //goInsert()
        document.querySelector('.go-insert').addEventListener('click', function() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(insertDB, errorCB, successCB);
        });

        //goSearch()
        document.querySelector('.go-search').addEventListener('click', function() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(searchQueryDB, errorCB);
        });

        //successCB()
        document.querySelector('.go-successCB').addEventListener('click', function() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
        });
    }
};

app.initialize();
