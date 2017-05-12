class CreateHikingRoutes < ActiveRecord::Migration[5.1]
  def change
    create_table :hiking_routes do |t|
      t.text :description, null: false
      t.st_point :check_point, geographic: true, has_z: true, null: false
      t.line_string :path, srid: 3785

      t.timestamps
    end
    add_index :hiking_routes, :check_point, using: :gist
    add_index :hiking_routes, :path, using: :gist
  end
end
