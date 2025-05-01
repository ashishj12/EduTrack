#!/bin/bash
set -e

echo "Seeding MongoDB..."

mongoimport --db EduTrack --collection admins --file /seed/admins.json --jsonArray
mongoimport --db EduTrack --collection faculties --file /seed/faculties.json --jsonArray
mongoimport --db EduTrack --collection students --file /seed/students.json --jsonArray

echo "Seeding complete."
