package org.zap.framework.common.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CustomDateSerializer extends JsonSerializer<LocalDateTime> {

	@Override
	public void serialize(LocalDateTime value, JsonGenerator jg,
                          SerializerProvider sp) throws IOException,
            JsonProcessingException {
		jg.writeString(value.format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss")));
	}

}
