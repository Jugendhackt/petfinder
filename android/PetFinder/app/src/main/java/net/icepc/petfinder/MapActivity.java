package net.icepc.petfinder;

import android.app.Activity;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.osmdroid.DefaultResourceProxyImpl;
import org.osmdroid.events.MapListener;
import org.osmdroid.events.ScrollEvent;
import org.osmdroid.events.ZoomEvent;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class MapActivity extends Activity implements View.OnClickListener{
    public Button btn1, btn2;
    public MapView mapView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map_layout);
        btn1 = (Button) findViewById(R.id.map_button_main);
        btn2 = (Button) findViewById(R.id.map_button_scanner);

        btn1.setOnClickListener(this);
        btn2.setOnClickListener(this);

        mapView = (MapView) findViewById(R.id.mapview);
        mapView.setBuiltInZoomControls(true);

        mapView.setMultiTouchControls(true);
        mapView.getController().setZoom(10);
        mapView.setClickable(true);
        mapView.getController().setCenter(new GeoPoint(52.48866, 13.33363));
        mapView.setMapListener(new MapListener() {
            @Override
            public boolean onScroll(ScrollEvent scrollEvent) {
                //Log.i("Scrolled____________________", "Nice");
                //getData();
                return false;
            }

            @Override
            public boolean onZoom(ZoomEvent zoomEvent) {
                //Log.i("Zoomed_____________________", "Nice");
                //getData();
                return false;
            }
        });


        createNewMarker(R.drawable.bunny, 52.48866, 13.33363, "Entlaufener Hase");
        createNewMarker(R.drawable.dog, 52.48897, 13.33465, "Entlaufener Hase");

        createNewMarker(R.drawable.dog, 52.48997, 13.35465, "Entlaufener Hase");
    }


    public void createNewMarker(int d, Double d1, Double d2, String s1){
        Drawable marker = getResources().getDrawable(d);
        int markerWidth = marker.getIntrinsicWidth();
        int markerHeight = marker.getIntrinsicHeight();
        marker.setBounds(0,markerWidth,markerHeight,0);
        MyItemizedOverlay mio = new MyItemizedOverlay(marker, new DefaultResourceProxyImpl(getApplicationContext()));
        mapView.getOverlays().add(mio);
        mio.addItem(new GeoPoint(d1,d2), s1, s1);
    }



    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.map_button_main:
                Intent intent = new Intent(this, MainActivity.class);
                startActivity(intent);
                break;
            case R.id.map_button_scanner:
                Intent intent2 = new Intent(this, ScannerActivity.class);
                startActivity(intent2);
                break;
        }
    }

    public void getData(){
        GeoPoint topRight = (GeoPoint)mapView.getProjection().fromPixels(mapView.getWidth(),0);
        GeoPoint bottomLeft = (GeoPoint)mapView.getProjection().fromPixels(0, mapView.getHeight());

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet("http://petfinder.pajowu.de/pets?bbox="+topRight.getLongitude()+","+topRight.getLatitude()+","+bottomLeft.getLongitude()+","+bottomLeft.getLatitude()+",");
        StringBuilder stringBuilder = new StringBuilder();

        try {
            HttpResponse response = httpClient.execute(httpGet);
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(response.getEntity().getContent()));

                String line;
                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line);
                }

                Log.i(this.getClass().getSimpleName(), stringBuilder.toString());
            } else {
                Log.e(this.getClass().getSimpleName(), "Fehler");
            }

        } catch (ClientProtocolException e) {
            Log.e(this.getClass().getSimpleName(), e.getMessage());

        } catch (IOException e) {
            Log.e(this.getClass().getSimpleName(), e.getMessage());
        }
    }
}

