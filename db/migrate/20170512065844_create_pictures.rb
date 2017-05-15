class CreatePictures < ActiveRecord::Migration[5.1]
  def change
    create_table :pictures do |t|
      t.integer :hiking_route_id, null: false
      t.text :description
      t.string :s3_name, null:false
      t.string :url, null: false

      t.timestamps
    end
    add_index :pictures, :s3_name, unique: true
    add_index :pictures, :url, unique: true
  end
end
