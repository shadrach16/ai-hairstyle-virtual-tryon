package com.hairstudio.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;

/**
 * Reads the Google Play Install Referrer (free, official deferred-attribution
 * channel). Always resolves (never rejects) — returns { referrer: null } when
 * unavailable so the JS layer degrades gracefully.
 */
@CapacitorPlugin(name = "InstallReferrer")
public class InstallReferrerPlugin extends Plugin {

    @PluginMethod
    public void getReferrer(final PluginCall call) {
        try {
            final InstallReferrerClient client = InstallReferrerClient.newBuilder(getContext()).build();
            client.startConnection(new InstallReferrerStateListener() {
                @Override
                public void onInstallReferrerSetupFinished(int responseCode) {
                    JSObject ret = new JSObject();
                    try {
                        if (responseCode == InstallReferrerClient.InstallReferrerResponse.OK) {
                            ReferrerDetails details = client.getInstallReferrer();
                            ret.put("referrer", details.getInstallReferrer());
                            ret.put("referrerClickTimestamp", details.getReferrerClickTimestampSeconds());
                            ret.put("installBeginTimestamp", details.getInstallBeginTimestampSeconds());
                        } else {
                            ret.put("referrer", (String) null);
                        }
                    } catch (Exception e) {
                        ret.put("referrer", (String) null);
                    } finally {
                        try { client.endConnection(); } catch (Exception ignored) {}
                        call.resolve(ret);
                    }
                }

                @Override
                public void onInstallReferrerServiceDisconnected() {
                    // No-op: a one-shot read; if it drops we simply don't resolve here.
                }
            });
        } catch (Throwable t) {
            JSObject ret = new JSObject();
            ret.put("referrer", (String) null);
            call.resolve(ret);
        }
    }
}
