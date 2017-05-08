class ApplicationController < ActionController::Base
  include Pundit
  # protect_from_forgery with: :exception

  def index
  end

  def lookup_user_by_token
    hmac_secret = Rails.application.secrets.hmac_secret
    token = params[:token]
    decoded_token = JWT.decode token, hmac_secret, true, { :algorithm => 'HS256' }
    id = decoded_token[0]['sub']
    @user = User.find(id)
  end

  def current_user
    @user
  end
end
