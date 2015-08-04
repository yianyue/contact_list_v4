class Contact < ActiveRecord::Base

  validates :first_name, :last_name, presence: true
  validates :email, format: {with: /\w+\.?\w+@\w+\.\w+/, message: "invalid email"}, uniqueness: true

  def to_s
    return [self.first_name, self.last_name, self.email, self.phone_num].join(' ')
  end

end