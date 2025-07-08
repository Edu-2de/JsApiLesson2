import pool from './connection';
import fs from 'fs';
import path from 'path';

export const checkIfTablesExist = async () =>{
    try {
        const result = await pool.query(`
            SELECT EXISTS(
                SELECT FROM account_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
                );
        `);
        return result.rows[0].exists;
    }catch(error){
        return false;
    }
}

let setupExecuted = false;

export const setupDatabase = async () =>{
    if(setupExecuted){
        console.log("⏭️ Database setup already completed, skipping...")
        return;
    }

    try{
        console.log('🔧 Setting up database...')

        const tableExist = await checkIfTablesExist();
        if(tableExist){
            console.log('✅ Database tables already exist, skipping setup...')
            setupExecuted = true;
            return;
        }

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        await pool.query(schemaSQL);
        console.log('✅ Database schema created successfully')

        setupExecuted = true;

    }catch(error){

    }
}