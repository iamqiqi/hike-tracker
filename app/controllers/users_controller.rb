class UsersController < ApplicationController

  def create
    newUser = User.new(username: params[:user][:username], email: params[:user][:email], password: params[:user][:password])
    puts newUser
    if newUser.save
        payload = { sub: newUser.id }
        hmac_secret = Rails.application.secrets.hmac_secret
        token = JWT.encode payload, hmac_secret, 'HS256'

        render json: { success: true, user: newUser.as_json.merge(token: token) }
    else
      render status: 500, json: { success: false, errors: newUser.errors }
    end
  end

  def update

  end

  def destroy
  end
end
