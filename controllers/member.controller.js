const client = require('twilio')("AC8c17e6648f4f93bfbacee4b086c21841", "88dbec0a42fec5b1ba4314ea07b5bef3");
const pool = require('../dbConfig');
const bcrypt = require('bcrypt');

const  getAllMembers = async (req, res) => {

    const getAllMembers = await pool.query("SELECT * FROM members");

// res.json( {data: getAllMembers.rows} );

res.render('member', { data: getAllMembers.rows } );
// pool.end();
};

const  getAllMembersCommittee = async (req, res) => {

    const getAllMembers = await pool.query("SELECT * FROM members");

// res.json( {data: getAllMembers.rows} );

res.render('committeeMember', { data: getAllMembers.rows } );
// pool.end();
};

const createNewMember = async (req, res)=> {
    const{first_name, last_name, phone, family_member, age, gender, 
        marital_status, 
        children_number,  
        email, 
        password, 
        password2} = req.body;

    // if(family_member > 0) {
        // console.log({
        //     first_name,
        //     last_name,
        //     phone,
        //     family_member,
        //     age,
        //     gender,
        //     marital_status,
        //     children_number, 
        // child_age, 
        // child_names, 
        //     email, 
        //     password, 
        //     password2
        // });

    // }else {
        console.log({
            first_name,
            last_name,
            phone,
            family_member,
            age,
            gender,
            marital_status, 
            email, 
            password, 
            password2
        });
    // }

    let errors = [];

    if (!email || !password || !password2 || !first_name || !last_name || !phone || !age || !gender || !marital_status || !family_member ) {
        // return res.json({status: 400, message: 'please enter all fields'});

        errors.push({message: "please enter all fields"});
    }
    if(password.length < 6){
        // return res.json({status: 400, message: 'password should be atleast 6 characters'});

        errors.push({message: "Password should be atleast 6 characters"});
    }

    if(password != password2){
        // return res.json({status: 400, message: 'Password does not match'});

        errors.push({message: "Password do not match"});
    }

    if(errors.length > 0) {
        res.render('register', {errors});
        // console.log("fill required fields");
    } else {
    //     //validation passed

        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword,"???");

        pool.query(
            `SELECT * FROM members WHERE email = $1`, [email], 
            (err, results)=>{
                if(err) {
                    throw err;
                }
                console.log('reaching here');
                console.log(results.rows);
            
                if (results.rows.length > 0) {
                    // return res.json({status: 400, message: 'email already exist'});
                    errors.push({message: "email already exist"});
                    // console.log('email already exist');
                    res.render("register", {errors});
                }else {
                    // const newMember = await 
                    pool.query(
                        `INSERT INTO members (first_name, last_name, email, phone, family_member, age, gender, marital_status, children_number, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,[first_name, last_name, email, phone, family_member, age, gender, marital_status, children_number, hashedPassword],
                        (err, results) => {
                            if (err){
                                throw err;
                            }
                            console.log(results.rows);
                            // return res.json({status: 200, message: 'now registered'});
                            req.flash('success_msg', "you are now registered, please login");
                            sendTextMessage();
                            res.redirect("/members");
                        } 
                    )
                    // if(newMember.rowCount === 0) {
                    //     return res.json({status: 400, message: 'bad request'});
                    // }
                    // return res.json({status: 200, message: 'member created', data: newMember.rows});
               
            }}
        )
}

async function sendTextMessage() {


    let phoneNumbers = await pool.query('SELECT phone FROM members WHERE member_id = $1', [id]);
    console.log(phoneNumbers.rows[0].phone, "...");

    client.messages.create({
        body: 'Hello from AgriCoop your login cridentialsare Email: ' + email + ' and password: ' + password + '.',
        to: phoneNumbers.rows[0].phone,
        from: '+19783301709'
    }).then(message => console.log(message))
        .catch(error => console.log(error))
}
};

const findMemberById = async (req, res, next) => {
        
    const id = req.params.id;
// try {
    const member = await pool.query("SELECT * FROM members WHERE member_id = $1", [id]); 
    
    if (member.rowCount === 0) {
        return res.json({status: 400, message: 'member does not exist'});
        // throw new Error (createError(404, "product not exist")); 

    } 
        // console.log(product);
    // res.json({status: 200, data: member.rows[0]});

    res.render('memberDetails', {data: member.rows});

    // } 
    // catch (error) {
    //     console.error(`member does not exist: ${error}`);
    // }
};

const findCommitteeById = async (req, res, next) => {
        
    const id = req.params.id;
// try {
    const member = await pool.query("SELECT * FROM members WHERE member_id = $1", [id]); 
    
    if (member.rowCount === 0) {
        return res.json({status: 400, message: 'member does not exist'});
        // throw new Error (createError(404, "product not exist")); 

    } 
        // console.log(product);
    // res.json({status: 200, data: member.rows[0]});

    res.render('committeeDetails', {data: member.rows});

    // } 
    // catch (error) {
    //     console.error(`member does not exist: ${error}`);
    // }
};

const updateMember = async (req, res, next) => {
    
    // try {
        const id =req.params.id ;
        const{first_name, last_name, phone, family_member, age, gender, 
            marital_status, 
            children_number, 
            email,
            role_name, 
            password, 
            password2} = req.body;
            
            // let errors = [];

            // if(password.length < 6){
            //     // return res.json({status: 400, message: 'password should be atleast 6 characters'});
        
            //     errors.push({message: "Password should be atleast 6 characters"});
            // }
        
            if(password != password2){
                return res.json({status: 400, message: 'Password does not match'});
        
                // errors.push({message: "Password do not match"});
            }

            // if(errors.length > 0) {
            //     res.render('edit', {errors});
            //     // console.log("fill required fields");
            // } else {
            //     //validation passed
        
                const hashedPassword = await bcrypt.hash(password, 10);
                // console.log(hashedPassword,"???");
        
                // pool.query(
                //     `SELECT * FROM members WHERE email = $1`, [email], 
                //     (err, results)=>{
                //         if(err) {
                //             throw err;
                //         }
                //         console.log('reaching here');
                //         console.log(results.rows);
                    
                //         if (results.rows.length > 0) {
                //             // return res.json({status: 400, message: 'email already exist'});
                //             errors.push({message: "email already exist"});
                //             // console.log('email already exist');
                //             res.render("edit", {errors});
                //         }else {
                            // const newMember = await 
                            const updateMember = await pool.query('UPDATE members SET first_name = $1, last_name = $2, email = $3, phone = $4, family_member = $5, age = $6, gender = $7, marital_status = $8, children_number = $9, role_name = $10, password = $11 WHERE member_id = $12', [first_name, last_name, email, phone, family_member, age, gender, marital_status, children_number, role_name, hashedPassword, id]);
                                // ,
                                // (err, results) => {
                                //     if (err){
                                //         throw err;
                                //     }
                                    // console.log(results.rows);
                                    // // return res.json({status: 200, message: 'now registered'});
                                    if (updateMember.rowCount === 0) {
                                        return res.json({status: 400, message: 'member does not exist'});
                                    } 
                                    sendTextMessage();
                                    res.redirect("/members");
                                // } 
                            // )
                            // if(newMember.rowCount === 0) {
                            //     return res.json({status: 400, message: 'bad request'});
                            // }
                            // return res.json({status: 200, message: 'member created', data: newMember.rows});
                       
                    // }}
                // )
        // }
        async function sendTextMessage() {


            let phoneNumbers = await pool.query('SELECT phone FROM members WHERE member_id = $1', [id]);
            console.log(phoneNumbers.rows[0].phone, "...");
    
            client.messages.create({
                body: 'Hello from AgriCoop your new email: ' + email + ' and new password: ' + password + ' has been made',
                to: phoneNumbers.rows[0].phone,
                from: '+19783301709'
            }).then(message => console.log(message))
                .catch(error => console.log(error))
        }
};

const updateMemberRoleById = async (req, res) => {
    const {id} = req.params;
    const {role_name} = req.body;
// try {
    const memberUpdateRole = await pool.query('UPDATE members SET  role_name = $1 WHERE member_id = $2', [role_name, id]); 

    if (memberUpdateRole.rowCount === 0) {

        return res.json({status: 400, message: 'member does not exist'});

    } 
        // return res.json({status: 200, message: 'member updated'});
        res.redirect('/members');
};

const deleteMember = async (req, res, next) => {
    try {
    const {id} = req.params;
        
            const deleteMember = await pool.query("DELETE FROM members WHERE member_id = $1", [id]);
            
            if (deleteMember.rowCount === 0) {
                return res.json({status: 400, message: 'member does not exist'});
            }  
            res.redirect('/members');
                // return res.json({status: 200, message: 'member deleted', res: deleteMember});
                // res.render('member', { data: deleteMember.rows } );
            
    } catch (error) {
        console.log(`member does not exist: ${error}`)
        return res.json({status: error.statusCode, message: error.message});
    }
};

const findMemberAccountById = async (req, res) => {
    const id = req.params.id;
    try {
        const acc = await pool.query('SELECT * FROM accounts INNER JOIN members USING (member_id) WHERE member_id = $1', [id]); 
        
        if (acc.rowCount === 0) {
            return res.json({status: 400, message: 'account does not exist'}); 
        } 
        // res.json({status: 200, data: acc.rows[0]});
        res.render('memberAccountDetails', {data: acc.rows});
        } 
        catch (error) {
            console.error(`account does not exist: ${error}`);
            // if (error instanceof Pool.CastError) {
            //     return next(createError(400, "Invalid Request"));
            // }
            // next(error);
        }
};

const findMemberAccountTransactionsById = async (req, res) => {
    const {id} = req.params;
    try {
        const trans = await pool.query("SELECT * FROM transactions INNER JOIN accounts USING (member_id) WHERE member_id = $1", [id]); 
        
        if (acc.rowCount === 0) {
            return res.json({status: 400, message: 'no transaction made on account'});
            // throw new Error (createError(404, "product not exist")); 
        } 
            // console.log(product);
        // res.json({status: 200, data: acc.rows[0]});
        res.render('memberTransactionDetails', {data: trans.rows});
    

        } 
        catch (error) {
            console.error(`account does not exist: ${error}`);
            // if (error instanceof Pool.CastError) {
            //     return next(createError(400, "Invalid Request"));
            // }
            // next(error);
        }
};

const getmemberTransaction = async (req, res) => {
    const {id} = req.params;
    const acc = await pool.query("SELECT acc_no FROM accounts INNER JOIN members USING (member_id) WHERE member_id = $1", [id]);
    const account = acc.rows[0].acc_no;
    console.log(account, "account number");
    const personalTransactions = await pool.query("SELECT * FROM transactions INNER JOIN accounts USING (acc_no) WHERE acc_no = $1", [account]);
    const date = await pool.query("SELECT transactions.updated_at FROM transactions INNER JOIN accounts USING (acc_no) WHERE acc_no = $1", [account]);
    // console.log(personalTransactions, "all personal transaction");
    console.log(date.rows, "dates");
    if (personalTransactions.rowCount === 0) {
       return res.json({status: 400, message: 'transaction does not exist'});
   } 
//    console.log(personalTransactions, "personalTransaction....");
   res.render('memberTransactionDetails', {data: personalTransactions.rows, query: personalTransactions.rows[0].amount, dt: date.rows[0].updated_at});
};

module.exports = {
    getAllMembers,
    createNewMember,
    updateMember,
    deleteMember,
    findMemberById,
    updateMemberRoleById,
    findMemberAccountById,
    findMemberAccountTransactionsById,
    getAllMembersCommittee,
    findCommitteeById,
    getmemberTransaction
}