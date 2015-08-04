class Contact < ActiveRecord::Base

  validates :first_name, :last_name, presence: true
  validates :email, format: {with: /\w+\.?\w+@\w+\.\w+/, message: "invalid email"}, uniqueness: true

end