<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Eventree Invoice</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 0;
            color: #222222;
            font-size: 13px;
            background: #ffffff;
        }

        .page {
            padding: 0 45px 40px 45px;
        }

        .header-band {
            width: 100%;
            background: #0d3b30;
            padding: 30px 45px;
            margin-bottom: 35px;
        }

        .logo-cell {
            vertical-align: middle;
        }

        .logo-text {
            font-size: 26px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 0.5px;
        }

        .tagline {
            color: #d4a054;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 4px;
        }

        .invoice-title {
            text-align: right;
            vertical-align: middle;
        }

        .invoice-label {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 2px;
        }

        .invoice-number {
            color: #cfd9d5;
            font-size: 11px;
            margin-top: 5px;
        }

        .info-table {
            width: 100%;
            margin-bottom: 30px;
        }

        .info-table td {
            vertical-align: top;
            padding: 5px 0;
        }

        .info-label {
            font-size: 10px;
            font-weight: bold;
            color: #d4a054;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }

        .info-box {
            background: #fdf6ec;
            border-left: 3px solid #d4a054;
            padding: 14px 18px;
            min-height: 48px;
        }

        .info-value {
            font-size: 13px;
            line-height: 1.6;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #0d3b30;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid #0d3b30;
        }

        .items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        .items-header td {
            background: #0d3b30;
            color: #ffffff;
            padding: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 0;
        }

        .items-header .price {
            text-align: right;
        }

        .items-row td {
            padding: 12px;
            border-bottom: 1px solid #e6e0d4;
        }

        .items-row:nth-child(odd) td {
            background: #fbfaf6;
        }

        .vendor-name {
            font-weight: bold;
            color: #0d3b30;
        }

        .price {
            text-align: right;
        }

        .total-table {
            width: 42%;
            margin-left: auto;
            margin-top: 25px;
            border-collapse: collapse;
        }

        .total-table td {
            padding: 9px 12px;
        }

        .subtotal-label {
            text-align: left;
            font-weight: bold;
            color: #444444;
        }

        .subtotal-value {
            text-align: right;
            color: #222222;
        }

        .grand-total td {
            background: #0d3b30;
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
            padding: 12px;
        }

        .grand-total .price {
            text-align: right;
        }

        .footer {
            margin-top: 60px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e6e0d4;
            font-size: 11px;
            color: #6b6b6b;
        }

        .footer-brand {
            color: #0d3b30;
            font-weight: bold;
        }
    </style>
</head>

<body>

    @php
        $hasDatabaseItems = !empty($items);

        $displaySubtotal = $hasDatabaseItems
            ? (float) $subtotal
            : 10000;
    @endphp

    <table class="header-band">
        <tr>
            <td class="logo-cell" width="50%">
                <div class="logo-text">Eventree</div>
                <div class="tagline">Event Vendor Marketplace</div>
            </td>

            <td class="invoice-title" width="50%">
                <div class="invoice-label">INVOICE</div>
                <div class="invoice-number">#{{ $event_id }}</div>
            </td>
        </tr>
    </table>

    <div class="page">

        <table class="info-table">
            <tr>
                <td width="50%">
                    <div class="info-label">Bill To</div>

                    <div class="info-box">
                        <div class="info-value">
                            <strong>{{ $customer['name'] }}</strong>
                            <br>
                            {{ $customer['email'] }}
                        </div>
                    </div>
                </td>

                <td width="50%">
                    <div class="info-label">Event Details</div>

                    <div class="info-box">
                        <div class="info-value">
                            Event ID: #{{ $event_id }}
                            <br>
                            Date: {{ \Carbon\Carbon::now()->format('d M, Y') }}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <div class="section-title">
            Selected Services
        </div>

        <table class="items">

            <tr class="items-header">
                <td width="40%">
                    Vendor Name
                </td>

                <td width="35%">
                    Package
                </td>

                <td width="25%" class="price">
                    Price
                </td>
            </tr>

            @forelse($items as $item)

                <tr class="items-row">
                    <td class="vendor-name">
                        {{ $item['vendor_name'] }}
                    </td>

                    <td>
                        {{ $item['package_name'] }}
                    </td>

                    <td class="price">
                        Tk {{ number_format((float) $item['package_price'], 2) }}
                    </td>
                </tr>

            @empty

                <tr class="items-row">
                    <td class="vendor-name">
                        Samin Enterprise
                    </td>

                    <td>
                        Basic
                    </td>

                    <td class="price">
                        Tk 10,000.00
                    </td>
                </tr>

            @endforelse

        </table>

        <table class="total-table">

            <tr>
                <td class="subtotal-label">
                    Subtotal
                </td>

                <td class="subtotal-value">
                    Tk {{ number_format($displaySubtotal, 2) }}
                </td>
            </tr>

            <tr class="grand-total">
                <td>
                    Total
                </td>

                <td class="price">
                    Tk {{ number_format($displaySubtotal, 2) }}
                </td>
            </tr>

        </table>

        <div class="footer">
            Thank you for choosing
            <span class="footer-brand">Eventree</span>.
            <br>
            Your event, your vendors, all in one place.
        </div>

    </div>

</body>
</html>