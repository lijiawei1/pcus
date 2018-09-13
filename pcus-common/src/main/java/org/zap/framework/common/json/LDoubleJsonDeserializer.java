package org.zap.framework.common.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.apache.commons.lang.StringUtils;
import org.zap.framework.lang.LDouble;

import java.io.IOException;

public class LDoubleJsonDeserializer extends JsonDeserializer<LDouble> {

	@Override
	public LDouble deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		try {
			return StringUtils.isBlank(jp.getText()) ? null : new LDouble(jp.getText());
		} catch (RuntimeException e) {
			throw new RuntimeException(e);
		}
	}

}
