class HikingRoute < ApplicationRecord
  has_many :pictures, dependent: :destroy
  belongs_to :user

  validates :description, presence: true
  validates :check_point, presence: true
  validates :user_id, presence: true
end
