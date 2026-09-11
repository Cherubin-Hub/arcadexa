import bcrypt from 'bcrypt';

async function main() {
    const hash = await bcrypt.hash('admin', 10);
    console.log('Use this hash in your SQL INSERT:');
    console.log(hash);
}

main();
