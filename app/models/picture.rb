class Picture < ApplicationRecord
  belongs_to :hiking_route

  validates :hiking_route_id, presence: true
  validates :s3_name, presence: true, uniqueness: true
end
