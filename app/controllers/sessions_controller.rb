class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:user][:email])

    if user
      if !user.authenticate(params[:user][:password])
        render status: 409, json: { errors: ['password is incorrect'] }
      else
        payload = { sub: user.id }
        hmac_secret = Rails.application.secrets.hmac_secret
        token = JWT.encode payload, hmac_secret, 'HS256'
        render json: { success: true, user: user.as_json.merge(token: token) }
      end
    else
      render status: 404, json: { success: false, errors: ['user doesnot exist'] }
    end
  end
end
