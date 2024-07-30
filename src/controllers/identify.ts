import pool from "../pg";

export const getDetails=async(req:any,res:any)=>{
    try {
        const { registration_number } =req.params
        pool.query('SELECT * FROM students WHERE registration_number=$1',[registration_number], (error, results) => {
            if (error) {
                console.log(error)
                res.status(404).send({error:`You are not authorized!`})
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
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}



