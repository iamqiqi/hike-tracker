class HikingRoutesController < ApplicationController
  before_action :lookup_user_by_token

  def index
    user_routes = current_user.hiking_routes
    populated_user_routes = user_routes.map do |route|
      {
        id: route.id,
        lat: route.check_point.lat,
        lng: route.check_point.lon,
        description: route.description
      }
    end
    render json: { routes: populated_user_routes }
  end

  def create
    new_route = HikingRoute.new
    new_route.check_point = "POINT(#{params[:lng]} #{params[:lat]})"
    new_route.description = params[:description]
    new_route.user_id = current_user.id

    if new_route.save
      populated_new_route = {
        id: new_route.id,
        lat: new_route.check_point.lat,
        lng: new_route.check_point.lon,
        description: new_route.description
      }
      render json: { new_route: populated_new_route }
    else
      render json: { error: new_route.errors }
    end
  end

  def update
    route = HikingRoute.find(params[:id])
    authorize route
    route.description = params[:description]
    if route.save
      populated_updated_route = {
        id: route.id,
        lat: route.check_point.lat,
        lng: route.check_point.lon,
        description: route.description
      }
      render json: { updated_route: populated_updated_route }
    else
      render json: { error: route.errors }
    end
  end

  def destroy
    route = HikingRoute.find(params[:id])
    authorize route
    route.destroy
    head status: 200
  end
end
