### Hotel Management Backend

Welcome to the Hotel Management Backend project! This project provides a backend API for managing rooms and room types in a hotel. It allows you to perform various operations such as creating, updating, and deleting rooms and room types, as well as fetching them from the database.

### Features

- **Room Types Management**: Create, retrieve, update, and delete room types.
- **Rooms Management**: Create, retrieve, update, and delete rooms.
- **Filtering**: Filter rooms based on search criteria such as room name, room type, minimum price, and maximum price.
- **Error Handling**: Comprehensive error handling for invalid requests and internal server errors.

### Usage

You can access the deployed API using the following base URL: [https://hotel-management-backend-o0o8.onrender.com](https://hotel-management-backend-o0o8.onrender.com)

#### Endpoints

- **POST /api/v1/room-types**: Create a new room type.
- **GET /api/v1/room-types**: Retrieve all room types.
- **POST /api/v1/rooms**: Create a new room.
- **GET /api/v1/rooms**: Retrieve all rooms with optional filtering.
- **PATCH /api/v1/rooms/{roomId}**: Update a room by its ID.
- **DELETE /api/v1/rooms/{roomId}**: Delete a room by its ID.
- **GET /api/v1/rooms/{roomId}**: Retrieve a room by its ID.

### Testing

You can test the API endpoints using tools like Postman or cURL. Simply send requests to the appropriate endpoints with the required parameters and observe the responses.

### Contributing

If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request. Your contributions are greatly appreciated!

### License

This project is licensed under the [MIT License](LICENSE).

Thank you for using the Hotel Management Backend! If you have any questions or need further assistance, please don't hesitate to contact me.
