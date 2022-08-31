const pool = require('../dbConfig');

const  getAllAccounts = async (req, res, next) => {

    const allAccounts = await pool.query("SELECT * FROM accounts INNER JOIN members USING (member_id) ");
// res.json({status: 200,data: allAccounts.rows});
res.render('account', {data: allAccounts.rows });
// pool.end();
};

const  getAllAccountsCommittee = async (req, res, next) => {

    const allAccounts = await pool.query("SELECT * FROM accounts INNER JOIN members USING (member_id) ");
// res.json({status: 200,data: allAccounts.rows});
res.render('committeeAccounts', {data: allAccounts.rows });
// pool.end();
};

const createNewAccount = async (req, res) => {
    const {acc_no, acc_type, amount, member_id} = req.body;

    let errors =[];

    if(!acc_no || !acc_type || !amount || !member_id){
        errors.push({message: "enter all fields"});
    }

    if(errors.length > 0){
        res.render('accRegister', {errors});
    } else {
        pool.query(`SELECT * FROM accounts WHERE acc_no = $1`, [acc_no], 
        (err, results)=>{
            if(err) {
                throw err;
            }
            if(results.rows.length > 0){
                errors.push({message: "account already exist"});
                res.render("accRegister", {errors});
            } else {
                 pool.query(
                    "INSERT INTO accounts (acc_no, acc_type, amount, member_id) VALUES ($1, $2, $3, $4 ) RETURNING *",
                    [acc_no, acc_type, amount, member_id], (err, results) => {
                        if (err){
                            throw err;
                        }
                        req.flash("success_msg", "new account created");
                        res.redirect('/accounts')
                    }
                )
            
                // if(newAccount.rowCount === 0) {
                //     return res.json({status: 400, message: 'bad request'});
                // }
            //     return res.json({status: 200, message: 'account created', data: newAccount.rows});
            }}
        )
        
    

    }
    };

const findAccountById = async (req, res) => {
    const {id} = req.params;
    try {
        const acc = await pool.query("SELECT * FROM accounts INNER JOIN members USING (member_id) WHERE acc_id = $1", [id]); 
        
        if (acc.rowCount === 0) {
            return res.json({status: 400, message: 'account does not exist'});
            // throw new Error (createError(404, "product not exist")); 

        } 
            // console.log(product);
        // res.json({status: 200, data: acc.rows[0]});
// res.render('memberAccountDetails', {data: acc.rows});
    

        } 
        catch (error) {
            console.error(`account does not exist: ${error}`);
            // if (error instanceof Pool.CastError) {
            //     return next(createError(400, "Invalid Request"));
            // }
            // next(error);
        }
};

const updateAccount= async (req, res, next) => {
    
        const {id} =req.params;
        const { acc_type, amount } = req.body;
        const updateAccount = await pool.query("UPDATE accounts SET acc_type = $1, amount = $2 WHERE acc_id = $3", [ acc_type, amount, id]);
        
        let errors = [];
        if (updateAccount.rowCount === 0) {

            errors.push({message: 'account does not exist'});

        } 
        res.redirect('/accounts');
            // return res.json({status: 200, message: 'account updated'});
};

const deleteAccount= async (req, res, next) => {
    try {
    const {id} = req.params;
        
            const deleteAccount = await pool.query("DELETE FROM accounts WHERE acc_id = $1", [id]);
            if (deleteAccount.rowCount === 0) {
                return res.json({status: 400, message: 'account does not exist'});
            }  
            res.redirect('/accounts');
                // return res.json({status: 200, message: 'account deleted', res: deleteAccount});
            
            
    } catch (error) {
        console.log(`account does not exist: ${error}`)
        return res.json({status: error.statusCode, message: error.message});
    }
}

const savingAccounts = async (req, res) =>{
    const save = "Saving";
    const saving = await pool.query('SELECT COUNT(acc_type) FROM accounts WHERE acc_type = $1 ',[save]);
    res.render('dashboard', {data: saving.rows });
}

module.exports = {
    getAllAccounts,
    createNewAccount,
    updateAccount,
    deleteAccount,
    findAccountById,
    getAllAccountsCommittee,
    savingAccounts
}