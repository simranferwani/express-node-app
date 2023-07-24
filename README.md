# express-node-app


We have created two tables user and hobbies 
user is having reference of hobbies in it whenever we are creating a user we add hobbies as well  the user has the ref of the hobbie unique id , which help us to map users and its different hobbies at same time

for example we 

method: get
url: http://localhost:9000/

result :
{
        "name": "Simran",
        "hobbies": [
            {
                "_id": "64bd7f60ac4163263544a9c3",
                "name": "Simran",
                "passionLevel": "high",
                "year": 2023,
                "__v": 0
            },
            {
                "_id": "64bd7f86ac4163263544a9c7",
                "name": "dancing",
                "passionLevel": "high",
                "year": 2023,
                "__v": 0
            }
        ]
    }

name is the unique key here hence when we add same user error ocurs
Response: {
    "error": "User already exists"
}


Add hobbies to that particular user is through
URL:http://localhost:9000/users/64be3c9b2664f7e1d14da270/hobbies
Method : Post 
body : {
        "name":"dancing",
        "year":"2023",
        "passionLevel":"high"
    }

Response:
{
    "_id": "64be3c9b2664f7e1d14da270",
    "name": "Simi",
    "hobbies": [
        "64be3cd42664f7e1d14da273"
    ],
    "__v": 1
}

curl : curl --location --request POST 'http://localhost:9000/users/64be3c9b2664f7e1d14da270/hobbies' \
--header 'Content-Type: application/json' \
--data-raw '{
        "name":"dancing",
        "year":"2023",
        "passionLevel":"high"
    }'


There are other apis to delete and update and add , get user , particular user and particular hobby 
    
