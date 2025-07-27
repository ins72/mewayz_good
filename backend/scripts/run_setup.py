"""
Master Setup Script for MEWAYZ V2
Runs all setup steps in sequence: database setup, data seeding, and migration
"""

import asyncio
import logging
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from scripts.setup_database import DatabaseSetup
from scripts.seed_data import DataSeeder
from scripts.migrate_mock_data import MockDataMigrator
from db.database import get_database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('setup.log')
    ]
)

logger = logging.getLogger(__name__)


class MasterSetup:
    """Master setup orchestrator"""
    
    def __init__(self):
        self.db = get_database()
        self.db_setup = DatabaseSetup(self.db)
        self.data_seeder = DataSeeder(self.db)
        self.migrator = MockDataMigrator(self.db)
    
    async def run_full_setup(self, seed_data: bool = True, migrate_mock: bool = True):
        """Run complete setup process"""
        logger.info("🚀 Starting MEWAYZ V2 Master Setup...")
        
        try:
            # Step 1: Database Setup
            logger.info("📊 Step 1: Database Setup")
            await self.db_setup.setup_database()
            
            # Step 2: Seed Data (optional)
            if seed_data:
                logger.info("🌱 Step 2: Data Seeding")
                await self.data_seeder.seed_all_data()
            
            # Step 3: Migrate Mock Data (optional)
            if migrate_mock:
                logger.info("🔄 Step 3: Mock Data Migration")
                await self.migrator.migrate_all_mock_data()
            
            logger.info("🎉 Master Setup completed successfully!")
            logger.info("📋 Next Steps:")
            logger.info("   1. Start the backend server: python -m uvicorn main:app --reload")
            logger.info("   2. Start the frontend: npm run dev")
            logger.info("   3. Access the application at http://localhost:3000")
            
        except Exception as e:
            logger.error(f"❌ Error during master setup: {e}")
            raise
    
    async def run_database_setup_only(self):
        """Run only database setup"""
        logger.info("📊 Running Database Setup Only...")
        await self.db_setup.setup_database()
        logger.info("✅ Database setup completed!")
    
    async def run_seeding_only(self):
        """Run only data seeding"""
        logger.info("🌱 Running Data Seeding Only...")
        await self.data_seeder.seed_all_data()
        logger.info("✅ Data seeding completed!")
    
    async def run_migration_only(self):
        """Run only mock data migration"""
        logger.info("🔄 Running Mock Data Migration Only...")
        await self.migrator.migrate_all_mock_data()
        logger.info("✅ Mock data migration completed!")


async def main():
    """Main function with command line argument support"""
    import argparse
    
    parser = argparse.ArgumentParser(description='MEWAYZ V2 Setup Script')
    parser.add_argument('--mode', choices=['full', 'database', 'seed', 'migrate'], 
                       default='full', help='Setup mode')
    parser.add_argument('--no-seed', action='store_true', 
                       help='Skip data seeding in full mode')
    parser.add_argument('--no-migrate', action='store_true', 
                       help='Skip mock data migration in full mode')
    
    args = parser.parse_args()
    
    setup = MasterSetup()
    
    if args.mode == 'full':
        seed_data = not args.no_seed
        migrate_mock = not args.no_migrate
        await setup.run_full_setup(seed_data=seed_data, migrate_mock=migrate_mock)
    elif args.mode == 'database':
        await setup.run_database_setup_only()
    elif args.mode == 'seed':
        await setup.run_seeding_only()
    elif args.mode == 'migrate':
        await setup.run_migration_only()


if __name__ == "__main__":
    asyncio.run(main()) 