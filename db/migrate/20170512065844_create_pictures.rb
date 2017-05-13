class CreatePictures < ActiveRecord::Migration[5.1]
  def change
    create_table :pictures do |t|
      t.string :hiking_route_id, null: false
      t.text :description
      t.string :s3_name, null:false

      t.timestamps
    end
    add_index :pictures, :s3_name, unique: true
  end
end
