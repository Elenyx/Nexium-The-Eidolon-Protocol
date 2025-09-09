import fs from 'fs';
import path from 'path';
/**
 * Runs all .sql migration files in a directory against the provided database.
 * @param db The SQLite database connection
 * @param migrationsDir Directory containing .sql migration files
 */
export function runMigrations(db, migrationsDir) {
    var files = fs.readdirSync(migrationsDir)
        .filter(function (f) { return f.endsWith('.sql'); })
        .sort();
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = path.join(migrationsDir, file);
        var sql = fs.readFileSync(filePath, 'utf-8');
        db.exec(sql);
        // Optionally log applied migration
        console.log("\u2705 Migration applied: ".concat(file));
    }
}
