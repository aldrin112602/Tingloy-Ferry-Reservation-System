<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .content p {
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Message from Tingloy Ferry Website</h2>
        </div>
        <div class="content">
            <p><strong>Name:</strong> {{ $validatedData['name'] }}</p>
            <p><strong>Email:</strong> {{ $validatedData['email'] }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ $validatedData['message'] }}</p>
        </div>
    </div>
</body>
</html>