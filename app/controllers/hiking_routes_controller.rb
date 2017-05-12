class HikingRoutesController < ApplicationController
  def create
    newRoute = HikingRoute.new
    newRoute.check_point = "POINT(#{params[:lng]} #{params[:lat]})"
    newRoute.description = params[:description]
    if newRoute.save
      render json: { newRoute: newRoute }
    else
      render json: { error: newRoute.errors }
    end
  end
end
