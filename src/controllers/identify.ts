import pool from "../pg";

export const getDetails=async(req:any,res:any)=>{
    try {
        const { registration_number, access_time } =req.body;
        pool.query('SELECT * FROM students WHERE registration_number=$1',[registration_number], (error, results) => {
            if (error) {
                console.log(error)
                res.status(404).send({error:`You are not authorized!`})
            }else{ 
                if(results.rows[0].registration_number){
                    pool.query('INSERT INTO access_records (registration_number, access_time) VALUES ($1, $2)',[results.rows[0].registration_number,access_time],(error,results)=>{
                        if(error){
                            console.log(error)
                            res.status(505).send({error:"Failed to authorize, try again!"})
                        }else{
                            res.status(200).json({
                                data:{
                                    full_name:results.rows[0].full_name,
                                    registration_number:results.rows[0].registration_number,
                                    type:results.rows[0].type,
                                    id_number:results.row[0].id_number,
                                    year_of_entry:results.rows[0].year_of_entry,
                                    year_of_exit:results.rows[0].year_of_exit,
                                    academic_year:results.rows[0].academic_year,
                                    semester:results.rows[0].semester,
                                    campus:results.rows[0].campus,
                                    course:results.rows[0].course,
                                    phone_number:results.rows[0].phone_number,
                                }
                            })
                        }
                    })
                }else{
                    res.status(401).send({error:"You are not authorized"})
                }
            }
        })
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}


export const addDetails=async(req:any,res:any)=>{
    try {
        const {full_name, registration_number,type,id_number,year_of_entry,year_of_exit,academic_year,semester,campus,course,phone_number}=req.body;
        if (full_name&&registration_number&&type&&year_of_entry&&year_of_exit&&academic_year&&semester&&campus&&course) {
            pool.query('INSERT INTO students (full_name, registration_number,type,id_number,year_of_entry,year_of_exit,academic_year,semester,campus,course,phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [full_name, registration_number,type,id_number,year_of_entry,year_of_exit,academic_year,semester,campus,course,phone_number], async(error:any, results) => {
                if (error) {
                    console.log(error)
                    res.status(408).send({error:`This student already exist!`})
                }else{
                    res.status(201).send({
                        msg:`Welcome ${results.rows[0].full_name}`,
                        data:{
                            registration_number:results.rows[0].registration_number,
                            type:results.rows[0].type
                            id_number:results.rows[0].id_number,
                            year_of_entry:results.rows[0].year_of_entry,
                            year_of_exit:results.rows[0].year_of_exit,
                            academic_year:results.rows[0].academic_year,
                            semester:results.rows[0].semester,
                            campus:results.rows[0].campus,
                            course:results.rows[0].course,
                            full_name:results.rows[0].full_name,
                            phone_number:results.rows[0].phone_number
                        }
                    })
                }
            })
            
        } else {
            res.status(403).send({error:"Fill all the required fields!!"})
        }
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

