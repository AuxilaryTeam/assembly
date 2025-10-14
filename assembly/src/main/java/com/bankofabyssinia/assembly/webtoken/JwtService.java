package com.bankofabyssinia.assembly.webtoken;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class JwtService {

	private static final String SECRET = "9a926f88170f69bd559568ca621ca722496b964698a5dbe9cc9a5a787e2bbdb4";
	private static final long VALIDITY = TimeUnit.MINUTES.toMillis(3000);

	public String generateToken(UserDetails userDetails) {
		Map<String, String> claims = new HashMap<>();
		claims.put("iss", "boaAuxNahom");
		claims.put("name","nahom");
	return Jwts.builder()
		.setClaims(claims)
		.setSubject(userDetails.getUsername())
		.setIssuedAt(Date.from(Instant.now()))
		.setExpiration(Date.from(Instant.now().plusMillis(VALIDITY)))
		.signWith(generateKey())
		.compact();
	}

	private SecretKey generateKey() {
		byte[] decodedKey = Base64.getDecoder().decode(SECRET);
		return Keys.hmacShaKeyFor(decodedKey);
	}

	public String extractUsername(String jwt) {
		Claims claims = getClaims(jwt);
		return claims.getSubject();
	}

	private Claims getClaims(String jwt) {
		return Jwts.parserBuilder()
				 .setSigningKey(generateKey())
				 .build()
				 .parseClaimsJws(jwt)
				 .getBody();
		// return Jwts.parser()
		//         //  .verifyWith(generateKey())
		//          .build()
		//          .parseSignedClaims(jwt)
		//          .getPayload();
	}

	public boolean isTokenValid(String jwt) {
		Claims claims = getClaims(jwt);
		return claims.getExpiration().after(Date.from(Instant.now()));
	}
}
