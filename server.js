const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const {getAllMembers, createNewMember, updateMember, deleteMember,findMemberById, updateMemberRoleById,
    findMemberAccountById, findMemberAccountTransactionsById, getAllMembersCommittee, findCommitteeById, getmemberTransaction, getTotalMembers} = require('./controllers/member.controller');
    const{getAllAccounts, updateAccount, deleteAccount, findAccountById, createNewAccount, getAllAccountsCommittee, savingAccounts, totalAccounts, getNumberOfSavingAccounts, getTotalNumberOfAccounts}= require('./controllers/account.controller');
const {makeNewTransaction, getAllTransactions, findTransactionByAccNo, getPersonalTransaction, printAllTransactions, printTransactions, getTotalAmount, getTotalTransaction} = require('./controllers/transaction.controller');
const initializePassport = require('./passportConfig');


initializePassport(passport);

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// app.set("views", './views');
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.get('/', (req, res) => {
    res.render("login");
});



app.get('/members/login', checkAuthenticated, (req, res) => {
        res.render("login");
    // return res.json({status: 200, message: 'logged in'});

});

app.get('/members/logout', (req, res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "you have logged out");
        res.redirect('/members/login');
      });
});

app.get('/members/register', (req,res)=>{
    res.render('register');
});

app.get('/members/dashboard', checkNoAuthenticated, async(req, res) => {
    if(req.user.role_name === 'admin'){
        const save = await getNumberOfSavingAccounts();
        const total = await getTotalNumberOfAccounts();
        const totalMembers = await getTotalMembers();
        const totalTransaction = await getTotalTransaction();
        res.render("dashboard", {user: req.user.first_name, data: req.user.member_id, save, total, totalMembers, totalTransaction});
    } else if(req.user.role_name === 'member'){
        res.render("memberDashboard", {user: req.user.first_name, data: req.user.member_id});
    }else  if(req.user.role_name === 'committee'){
        const total = await getTotalNumberOfAccounts();
        const save = await getNumberOfSavingAccounts();
        const totalMembers = await getTotalMembers();
        const totalTransaction = await getTotalTransaction();
        res.render("commiteeDashboard", {user: req.user.first_name, data: req.user.member_id, save, total, totalMembers, totalTransaction});
    }else{
        res.render("index", {user: req.user.first_name});
    }    
});

// app.get('/members/accounts', (req, res) => {
//     res.render("member");
// });

app.get('/members', getAllMembers);

app.get('/members/committee', getAllMembersCommittee);

app.get('/profile', (req, res) => {
    res.render('profile');
});

// , 
// (req, res)=>{
//     res.render('login');
// };
// app.use('/accounts', accountRoutes);



app.get('/members/committee', (req, res) => {
    res.render('commitee');
});

app.get('/members/member', (req, res) => {
    res.render('member');
});


app.get('/members/personal/(:id)', findMemberById
, (req, res) => {
    res.render("memberDetails", { data: req.user.member_id });
}
);

// app.get('/members/committee/(:id)', findCommitteeById
// , (req, res) => {
//     res.render("committeeDetails", { data: req.user.member_id });
// }
// );

app.get('/members/edit/(:id)', (req,res)=>{
    res.render('edit', {data: req.params.id});
});

app.get('/members/roleEdit/(:id)', (req,res)=>{
    res.render('editRole', {data: req.params.id});
});

app.get("/members/delete/(:id)", (req,res)=>{
    res.render('member', {id: req.params.id});
});

app.get('/members/account/(:id)', findMemberAccountById, (req,res)=>{
    res.render('memberAccountDetails', {data: req.user.member_id} );
});

app.get('/transaction/member/(:id)', getmemberTransaction,(req, res) =>{
    res.render('memberTransactionDetails', {id: req.user.member_id})
});

app.get('/account/amount', getTotalAmount);

// app.get('/members/transaction/(:id)', getAllTransactionsMember, (req,res)=>{
//     res.render('memberTransactionDetails', {query: req.user.acc_number} );
// });

app.get('/accounts/register', (req,res)=>{
    res.render('accRegister');
});

app.get('/accounts', getAllAccounts);

// app.get('/savingAccount', savingAccounts);

app.get('/accounts/committee', getAllAccountsCommittee);
// app.get('/accounts/(:id)',(req, res)=> {
//     res.render('memberAccountDetails', {data: req.params.id});
// });

app.get('/accounts/edit/(:id)', (req,res)=>{
    res.render('editAccount', {data: req.params.id});
});

app.get("/accounts/delete/(:id)", (req,res)=>{
    res.render('account', {id: req.params.id});
});

app.get('/makeTransaction',(req, res)=> {
    res.render('transaction');
});

app.get('/accounts/allTransactions', getAllTransactions);
// app.get('/accounts/printTransaction', printTransactions);

app.get('/transaction/personal/(:id)', getPersonalTransaction,(req, res) =>{
    res.render('committeeTransaction', {id: req.user.member_id})
});

// app.get('/scripts', scripts);

app.post('/members/register', createNewMember);

app.post('/members/personal/(:id)', findMemberById);

app.post('/members/roleEdit/(:id)', updateMemberRoleById);

app.post('/members/edit/(:id)', updateMember);

app.post('/members/delete/:id', deleteMember);

// app.post('/members/account/:id', findMemberAccountById);

app.post('/accounts/register', createNewAccount);

app.post('/accounts/(:id)', findAccountById);

app.post('/accounts/edit/(:id)', updateAccount);

app.post('/accounts/delete/(:id)', deleteAccount);

app.post('/makeTransaction', makeNewTransaction);

// app.post('/accounts/personalTransactions/(:acc_no)', getPersonalTransaction);

app.post(
    '/members/login', 
    passport.authenticate("local", ({
    successRedirect: '/members/dashboard',
    failureRedirect: '/members/login',
    failureFlash: true 
})
// , (req, res, user) => {
//     if(req.user.role_name === 'admin'){
//         res.render("dashboard", {user: req.user.first_name});
//     }
//     if(req.user.role_name === 'member'){
//         res.render("admin", {user: req.user.first_name});
//     } if(req.user.role_name === 'committee'){
//         res.render("commitee", {user: req.user.first_name});
//     }
// }
));

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.body.role_name === "admin"){
        return res.redirect('/members/dashboard');
    }  else if(req.isAuthenticated() && req.body.role_name === "committee"){
        return res.redirect('/members/committee');
    }else if(req.isAuthenticated() && req.body.role_name === "member"){
        return res.redirect('/members/member')
    }
    next();
}

function checkNoAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/members/login');
}


const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

