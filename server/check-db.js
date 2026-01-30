import Database from 'better-sqlite3';

const db = new Database('./cyber-solution.db');

console.log('\n=== ENTREPRISES INSCRITES ===\n');

const users = db.prepare('SELECT id, email, company_name, role, created_at FROM users').all();

if (users.length === 0) {
    console.log('❌ Aucune entreprise inscrite pour le moment\n');
} else {
    users.forEach(user => {
        console.log(`📊 ${user.company_name}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Inscrit le: ${user.created_at}`);
        console.log('');
    });
    console.log(`Total: ${users.length} entreprise(s)\n`);
}

console.log('=== FORMATIONS DISPONIBLES ===\n');
const trainings = db.prepare('SELECT id, title, category, price, level FROM training_modules').all();
trainings.forEach(t => {
    console.log(`${t.id}. ${t.title} (${t.category}) - ${t.price}€ - ${t.level}`);
});

console.log('\n=== INSCRIPTIONS FORMATIONS ===\n');
const enrollments = db.prepare(`
  SELECT utp.*, u.email, u.company_name, tm.title, tm.price 
  FROM user_training_progress utp
  JOIN users u ON utp.user_id = u.id
  JOIN training_modules tm ON utp.training_id = tm.id
`).all();

if (enrollments.length === 0) {
    console.log('❌ Aucune inscription aux formations\n');
} else {
    enrollments.forEach(e => {
        console.log(`🎓 ${e.company_name} → ${e.title}`);
        console.log(`   Email: ${e.email}`);
        console.log(`   Prix: ${e.price}€`);
        console.log(`   Statut paiement: ${e.payment_status}`);
        console.log(`   Progression: ${e.progress}%`);
        console.log(`   Inscrit le: ${e.enrolled_at}`);
        console.log('');
    });
}

db.close();
