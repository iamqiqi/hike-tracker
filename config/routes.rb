Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'application#index'

  resources :users, only: [:create, :show, :update, :destroy]

  resources :sessions, only: [:create]

  resources :hiking_routes, only: [:index, :create, :show, :update, :destroy]

  resources :pictures, only: [:index, :create, :show, :destroy]

  get '*path', to: 'application#index'
end
