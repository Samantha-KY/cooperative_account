const client = require('twilio')("AC8c17e6648f4f93bfbacee4b086c21841", "0e5f194e2217466a04f52f987c236e87");
const pool = require('../dbConfig');

const  getAllTransactions = async (req, res, next) => {
    const allTransaction = await pool.query("SELECT * FROM transactions");
res.render('allTransactions', {data: allTransaction.rows });
};


const makeNewTransaction = async (req, res) => {
   
    let {acc_number, t_type, t_amount, description} = req.body;
    
    
    let errors =[];

    if(!acc_number || !t_type || !t_amount || !description){
        errors.push({message: "enter all fields"});
    }
    if(t_type !== 'withdraw' && t_type !== 'deposit'){
        errors.push({message: "invalid transaction type"});
    }
    if(errors.length > 0){
        res.render('transaction', {errors});
    }
    else {
        pool.query("SELECT * FROM accounts WHERE acc_no = $1", [acc_number], 
        (err, results)=>{
            if(err) {
                throw err;
            }
            if(results.rows.length = 0){
                res.json(results.rows)
                errors.push({message: "account does not exist"});
                res.render("transaction", {errors});
            } else {
                pool.query(
                    `INSERT INTO transactions (t_type, t_amount, description, acc_no) VALUES ($1, $2, $3, $4) `,
                    [t_type, t_amount, description, acc_number], (err, results) => {
                        if (err){
                            throw err;
                        }
                        
                        if(t_type === 'deposit'){
                            pool.query(`UPDATE accounts SET  amount = amount + ${t_amount} FROM transactions WHERE accounts.acc_no = transactions.acc_no`);
                            
                        } else {
                            pool.query(`UPDATE accounts SET  amount = amount - ${t_amount} FROM transactions WHERE accounts.acc_no = transactions.acc_no`);
                            
                        }
                        sendTextMessage();
                        res.redirect('back');
                    }
                )
            }
        }
        ) 
    }
    async function sendTextMessage(){

     
     let phoneNumbers = await pool.query('SELECT phone FROM accounts INNER JOIN members USING (member_id) WHERE acc_no = $1',[acc_number]);
    console.log(phoneNumbers.rows[0].phone, "...");

        client.messages.create({
            body: 'Hello from AgriCoop the payment of '+ t_amount + ' for '+ description + ' has been made',
            to: phoneNumbers.rows[0].phone,
            from: '+19783301709'
        }).then(message => console.log(message))
        .catch(error => console.log(error))
    }
    };
    

    const findTransactionByAccNo = async (req, res) => {
        const id = req.params.id;
        
        try {
            const trans = await pool.query("SELECT * FROM transactions INNER JOIN accounts USING (acc_id) WHERE acc_no = $1", [id]); 
            
            if (trans.rowCount === 0) {
                return res.json({status: 400, message: 'transaction does not exist'});
            } 

            res.render('memberTransactionDetails', {query: trans.rows });
            
        } 
            catch (error) {
                console.error(`transaction does not exist: ${error}`);

            }
    };

    const deleteTransaction= async (req, res, next) => {
        try {
        const {id} = req.params;
            
                const deleteTransaction = await pool.query("DELETE FROM transactions WHERE transaction_id = $1", [id]);
                if (deleteAccount.rowCount === 0) {
                    return res.json({status: 400, message: 'transaction does not exist'});
                }  
                res.redirect('/accounts');
                    
                
                
        } catch (error) {
            console.log(`account does not exist: ${error}`)
            return res.json({status: error.statusCode, message: error.message});
        }
    }
    
const getPersonalTransaction = async (req, res) => {
     const {id} = req.params;
     const acc = await pool.query("SELECT acc_no FROM accounts INNER JOIN members USING (member_id) WHERE member_id = $1", [id]);
     const account = acc.rows[0].acc_no;
     console.log(account, "account number");
     const personalTransactions = await pool.query("SELECT * FROM transactions INNER JOIN accounts USING (acc_no) WHERE acc_no = $1", [account]);
     if (personalTransactions.rowCount === 0) {
        return res.json({ message: 'no transaction have been made'});
    } 
    console.log(personalTransactions, "personalTransaction....");
    res.render('committeeTransaction', {data: personalTransactions.rows });
}
const  printTransactions = async (req, res, next) => {
    const printTransactions = await pool.query("SELECT * FROM transactions");
res.render('print', {data: printTransactions.rows });
};

    module.exports = {
        getAllTransactions,
        makeNewTransaction,
        findTransactionByAccNo,
        deleteTransaction,
        getPersonalTransaction,
        printTransactions
    }