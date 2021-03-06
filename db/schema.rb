# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170512065844) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "hiking_routes", force: :cascade do |t|
    t.integer "user_id", null: false
    t.text "description", null: false
    t.geography "check_point", limit: {:srid=>4326, :type=>"st_point", :has_z=>true, :geographic=>true}, null: false
    t.geometry "path", limit: {:srid=>3785, :type=>"line_string"}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["check_point"], name: "index_hiking_routes_on_check_point", using: :gist
    t.index ["path"], name: "index_hiking_routes_on_path", using: :gist
  end

  create_table "pictures", force: :cascade do |t|
    t.integer "hiking_route_id", null: false
    t.text "description"
    t.string "s3_name", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["s3_name"], name: "index_pictures_on_s3_name", unique: true
    t.index ["url"], name: "index_pictures_on_url", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
