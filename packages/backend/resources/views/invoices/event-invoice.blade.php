<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <title>Eventree Invoice</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 40px;
            color: #222;
            font-size: 13px;
        }

        .header {
            width: 100%;
            margin-bottom: 35px;
        }

        .logo {
            font-size: 28px;
            font-weight: bold;
        }

        .invoice-title {
            font-size: 26px;
            font-weight: bold;
            text-align: right;
        }

        .info-table {
            width: 100%;
            margin-bottom: 30px;
        }

        .info-table td {
            vertical-align: top;
            padding: 5px 0;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .items th {
            background: #f1f3f8;
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        .items td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        .price {
            text-align: right;
        }

        .total-table {
            width: 40%;
            margin-left: auto;
            margin-top: 25px;
        }

        .total-table td {
            padding: 8px;
        }

        .grand-total {
            font-size: 17px;
            font-weight: bold;
            border-top: 2px solid #222;
        }

        .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 11px;
            color: #777;
        }
    </style>
</head>

<body>

    <table class="header">
        <tr>
            <td>
                <div class="logo">Eventree</div>
                <div>Event Vendor Marketplace</div>
            </td>

            <td class="invoice-title">
                INVOICE
            </td>
        </tr>
    </table>


    <table class="info-table">
        <tr>
            <td width="50%">
                <strong>Bill To</strong><br>

                {{ $customer['name'] }}<br>
                {{ $customer['email'] }}
            </td>

            <td width="50%">
                <strong>Event ID</strong><br>

                #{{ $event_id }}
            </td>
        </tr>
    </table>


    <div class="section-title">
        Selected Services
    </div>


    <table class="items">

        <thead>
            <tr>
                <th>Vendor</th>
                <th>Package</th>
                <th class="price">Price</th>
            </tr>
        </thead>

        <tbody>

            @foreach($items as $item)

                <tr>
                    <td>
                        {{ $item['vendor_name'] }}
                    </td>

                    <td>
                        {{ $item['package_name'] }}
                    </td>

                    <td class="price">
                        ৳{{ number_format((float) $item['package_price'], 2) }}
                    </td>
                </tr>

            @endforeach

        </tbody>

    </table>


    <table class="total-table">

        <tr>
            <td>Subtotal</td>

            <td class="price">
                ৳{{ number_format((float) $subtotal, 2) }}
            </td>
        </tr>

        <tr class="grand-total">
            <td>Total</td>

            <td class="price">
                ৳{{ number_format((float) $subtotal, 2) }}
            </td>
        </tr>

    </table>


    <div class="footer">
        Thank you for choosing Eventree.
        <br>
        Your event, your vendors, all in one place.
    </div>

</body>
</html>