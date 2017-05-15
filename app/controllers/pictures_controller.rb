class PicturesController < ApplicationController
  def create
    Aws.config[:credentials] = Aws::Credentials.new(Rails.application.secrets.s3_access_key, Rails.application.secrets.s3_secret_key)
    s3 = Aws::S3::Resource.new(region: 'us-west-1')

    filename = ('a'..'z').to_a.shuffle[0..7].join + "-#{params[:filename]}"
    obj = s3.bucket('hikingtracker').object(filename)
    data = Base64.decode64(params[:data].split(',')[1])

    obj.put(body: data)
    obj.acl.put(acl: 'public-read')

    new_picture = Picture.new(hiking_route_id: params[:route_id], url: obj.public_url, s3_name: filename)

    if new_picture.save
      render json: { url: obj.public_url }
    else
      render json: { errors: new_picture.errors }
    end
  end
end
