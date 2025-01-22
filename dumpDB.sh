#!/bin/bash

DATABASE_NAME="BeavGuesser"
BACKUP_FOLDER="db_dump"

mongodump --db $DATABASE_NAME --out $BACKUP_FOLDER

