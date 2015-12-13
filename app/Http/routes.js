'use strict'

/*
|--------------------------------------------------------------------------
|   Routes
|--------------------------------------------------------------------------
|
|   Here we register application routes and bind controller methods or
|   Closures to them. Keep this file for defining routes only and do
|   not pollute it by writing application specific code.
|
*/

const Route = use('Route')

Route.get('/', 'AuthController.index')
Route.get('/initiate', 'AuthController.initiate')
Route.get('/oauth', 'AuthController.callback')
