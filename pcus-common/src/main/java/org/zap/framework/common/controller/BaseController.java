package org.zap.framework.common.controller;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.PropertiesEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.zap.framework.common.json.CustomObjectMapper;
import org.zap.framework.lang.LDouble;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.security.utils.SecurityUtils;
import org.zap.framework.util.DataTypeUtils;
import org.zap.framework.util.DateUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

//import org.zap.framework.security.utils.SecurityUtils;

/**
 * 所有业务控制器都要继承
 * @author Shin
 *
 */
public abstract class BaseController {

	@Autowired
	CustomObjectMapper mapper;

	/**
	 * 初始化绑定
	 *
	 * @param binder 数据绑定
	 */
	@InitBinder
	protected void initBinder(WebDataBinder binder) {
		binder.registerCustomEditor(String.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DataTypeUtils.parseString(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
		binder.registerCustomEditor(Boolean.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DataTypeUtils.parseBoolean(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
		binder.registerCustomEditor(boolean.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DataTypeUtils.parseBool(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
		binder.registerCustomEditor(long.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(StringUtils.isBlank(text) || "null".equals(text.trim()) ? 0L : Long.parseLong(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
		binder.registerCustomEditor(double.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(StringUtils.isBlank(text) || "null".equals(text.trim()) ? 0.0 : Double.parseDouble(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});

		binder.registerCustomEditor(LDouble.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DataTypeUtils.parseLDouble(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});

		binder.registerCustomEditor(int.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DataTypeUtils.parseInt(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});

		binder.registerCustomEditor(LocalDate.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DateUtils.parseDate(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
		binder.registerCustomEditor(LocalDateTime.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DateUtils.parseDateTime(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
		binder.registerCustomEditor(LocalTime.class, new PropertiesEditor() {
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				setValue(DateUtils.parseTime(text));
			}

			@Override
			public String getAsText() {
				return getValue().toString();
			}
		});
	}

	/**
	 * 获取登录用户
	 *
	 * @return User
	 */
	protected User getUser() {
		return SecurityUtils.getCurrentUser();
	}
}
