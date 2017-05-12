class HikingRoute < ApplicationRecord
  validates :description, presence: true
  validates :check_point, presence: true
end
