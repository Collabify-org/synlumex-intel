export function baseEmail({ title, body }: { title: string; body: string }) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:12px;border:1px solid #1f2937;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #1f2937;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#1e40af 0%,#0ea5e9 100%);display:inline-block;"></div>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <div style="font-size:14px;font-weight:700;color:#f8fafc;letter-spacing:-0.3px;">SYNLUMEX</div>
                    <div style="font-size:9px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#94a3b8;letter-spacing:2px;">INTEL</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#f8fafc;letter-spacing:-0.3px;">${title}</h1>
              <div style="font-size:14px;line-height:1.6;color:#cbd5e1;">
                ${body}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #1f2937;background:#0d1424;">
              <div style="font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#64748b;">
                Sent by SYNLUMEX INTEL · Owner-side Project Operating System
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function trialEndingEmail({ orgName, daysLeft, planName }: { orgName: string; daysLeft: number; planName: string }) {
  return baseEmail({
    title: `Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    body: `
      <p style="margin:0 0 14px 0;">Hi ${orgName} team,</p>
      <p style="margin:0 0 14px 0;">Your <strong>${planName}</strong> trial ends in <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong>. To keep using SYNLUMEX INTEL without interruption, please renew your plan.</p>
      <p style="margin:0 0 20px 0;color:#94a3b8;font-size:13px;">Contact us to upgrade — we'll handle it manually and get you back up in minutes.</p>
      <p style="margin:0;"><a href="https://wa.me/919999999999?text=Renew%20my%20SYNLUMEX%20plan" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#1e40af 0%,#0ea5e9 100%);color:#ffffff;text-decoration:none;border-radius:6px;font-weight:500;font-size:13px;">Renew Plan</a></p>
    `
  });
}

export function projectRedEmail({ orgName, projectCode, projectName, health }: { orgName: string; projectCode: string; projectName: string; health: string }) {
  return baseEmail({
    title: `Project health alert: ${projectCode}`,
    body: `
      <p style="margin:0 0 14px 0;">Hi ${orgName} team,</p>
      <p style="margin:0 0 14px 0;">The following project has turned <strong style="color:#ef4444;">${health.toUpperCase()}</strong> and requires intervention:</p>
      <table cellpadding="0" cellspacing="0" style="background:#0a0e1a;border:1px solid #1f2937;border-radius:8px;padding:14px 18px;margin:0 0 20px 0;width:100%;">
        <tr><td style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#0ea5e9;padding:2px 0;">${projectCode}</td></tr>
        <tr><td style="font-size:14px;color:#f8fafc;padding:2px 0;">${projectName}</td></tr>
      </table>
      <p style="margin:0;"><a href="https://synlumex-intel.vercel.app/projects" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#1e40af 0%,#0ea5e9 100%);color:#ffffff;text-decoration:none;border-radius:6px;font-weight:500;font-size:13px;">View Project</a></p>
    `
  });
}

export function inactiveEmail({ orgName, days }: { orgName: string; days: number }) {
  return baseEmail({
    title: `We miss you — ${days} days since last check-in`,
    body: `
      <p style="margin:0 0 14px 0;">Hi ${orgName} team,</p>
      <p style="margin:0 0 20px 0;">It's been <strong>${days} days</strong> since your last login. Projects move fast — make sure nothing has slipped through while you were away.</p>
      <p style="margin:0;"><a href="https://synlumex-intel.vercel.app/dashboard" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#1e40af 0%,#0ea5e9 100%);color:#ffffff;text-decoration:none;border-radius:6px;font-weight:500;font-size:13px;">Open Dashboard</a></p>
    `
  });
}

export function weeklyDigestEmail({
  orgName,
  projectCount,
  criticalCount,
  openExceptions,
  unbilledRevenue
}: {
  orgName: string;
  projectCount: number;
  criticalCount: number;
  openExceptions: number;
  unbilledRevenue: string;
}) {
  return baseEmail({
    title: `Weekly digest — ${orgName}`,
    body: `
      <p style="margin:0 0 14px 0;">Here's your week at a glance:</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px 0;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
            <table width="100%"><tr>
              <td style="color:#94a3b8;font-size:13px;">Active Projects</td>
              <td align="right" style="color:#f8fafc;font-size:18px;font-weight:600;">${projectCount}</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
            <table width="100%"><tr>
              <td style="color:#94a3b8;font-size:13px;">Critical Projects</td>
              <td align="right" style="color:${criticalCount > 0 ? '#ef4444' : '#f8fafc'};font-size:18px;font-weight:600;">${criticalCount}</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1f2937;">
            <table width="100%"><tr>
              <td style="color:#94a3b8;font-size:13px;">Open Exceptions</td>
              <td align="right" style="color:${openExceptions > 0 ? '#f59e0b' : '#f8fafc'};font-size:18px;font-weight:600;">${openExceptions}</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;">
            <table width="100%"><tr>
              <td style="color:#94a3b8;font-size:13px;">Unbilled Revenue</td>
              <td align="right" style="color:#0ea5e9;font-size:18px;font-weight:600;">${unbilledRevenue}</td>
            </tr></table>
          </td>
        </tr>
      </table>
      <p style="margin:0;"><a href="https://synlumex-intel.vercel.app/dashboard" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,#1e40af 0%,#0ea5e9 100%);color:#ffffff;text-decoration:none;border-radius:6px;font-weight:500;font-size:13px;">Open Command Center</a></p>
    `
  });
}
