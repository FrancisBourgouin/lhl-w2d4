const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const uuidv4 = require('uuid/v4');
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['IlovecookiesessionsTheyAreTheBest!']
}))
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');


//keep your properties in the same order, not like this !
const userDatabaseIsh = {
    f4v5h: {
        username: "bob",
        id: "f4v5h",
        password: "1234"
    },
    j7k9l: {
        id: "j7k9l",
        username: "strangerdanger",
        password: "boo"
    }
}
//How to add a property
userDatabaseIsh.f4v5h.name = "Bob the Conqueror"

//Adding a new user, create the user, then add it as a property
const newUser = {
    id:'zla45',
    username:'Dimitri',
    name:'Dimitri Ivanovich Mendeleiv',
    password:'periodictable'
}
userDatabaseIsh[newUser.id] = newUser
let authenticateUser = (username, password) => {
    for (userId in userDatabaseIsh) {
        let currentUser = userDatabaseIsh[userId]
        if (currentUser.username === username && currentUser.password === password) {
            return currentUser.id
        }
    }
    return false
}
console.log(authenticateUser('bob', '1234'))
console.log(authenticateUser('bob', '12345'))



app.get('/', (req,res) => {
    // const username = userDatabaseIsh[req.cookies.userId].username
    console.log('session ?', req.session.userId)
    let username = ""
    if(req.session.userId){
        username = userDatabaseIsh[req.session.userId].username
    }

    const templateVars = {username: username}
    res.render('home', templateVars)
})
app.post('/login', (req,res) => {
    console.log('Login values :', req.body['username'], req.body.password)
    // if(req.body.username === "bob"){
    //     res.cookie('username', req.body.username)
    // }
    // else{
    //     res.cookie('username', 'STRANGER DANGER')
    // }
    const authenticate = authenticateUser(req.body.username, req.body.password)
    if(authenticate){
        // res.cookie('userId', authenticate )
        req.session.userId = authenticate
    }else{
        // res.cookie('userId', '')
        req.session.userId = ''
        // delete req.session.userId
    }
    res.redirect('/')
})

app.listen(port, () => console.log(`Express server running on port ${port}`));
