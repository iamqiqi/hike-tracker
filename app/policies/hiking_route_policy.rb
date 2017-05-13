class HikingRoutePolicy
  attr_reader :user, :hiking_route

  def initialize(user, hiking_route)
    @user = user
    @hiking_route = hiking_route
  end

  def create?
    !@user.nil?
  end

  def update?
    @hiking_route.user == user
  end

  def destroy?
    update?
  end
end
